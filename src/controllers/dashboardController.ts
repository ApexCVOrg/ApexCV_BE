import { Request, Response } from 'express'
import { Product } from '../models/Product'
import { Order } from '../models/Order'
// import { User } from '../models/User'
// import { Category } from '../models/Category'
import { DashboardData, SalesChartData, TopProduct, OrderStat } from '../types/type.d'

// Helper function to get month name
const getMonthName = (month: number): string => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
  return months[month - 1]
}

// Helper function to get status color
const getStatusColor = (status: string): string => {
  const colors: { [key: string]: string } = {
    pending: '#FFA500',
    paid: '#4CAF50',
    shipped: '#2196F3',
    delivered: '#4CAF50',
    cancelled: '#F44336'
  }
  return colors[status] || '#9E9E9E'
}

// Main dashboard summary endpoint
export const getDashboardSummary = async (_req: Request, res: Response): Promise<void> => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Calculate 12 months ago for sales chart
    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11)
    twelveMonthsAgo.setDate(1)
    twelveMonthsAgo.setHours(0, 0, 0, 0)

    // Parallel execution of all dashboard queries
    const [
      lowStockCount,
      todaySalesResult,
      deliveredOrders,
      totalOrders,
      cancelledOrders,
      salesChartData,
      topProductsData,
      orderStatsData
    ] = await Promise.all([
      // Low stock products count
      Product.countDocuments({
        $or: [{ 'sizes.stock': { $lt: 5 } }, { status: 'out_of_stock' }]
      }),

      // Today's sales - using paidAt instead of createdAt
      Order.aggregate([
        {
          $match: {
            paidAt: { $gte: today, $lt: tomorrow },
            isPaid: true
          }
        },
        {
          $group: {
            _id: null,
            totalSales: { $sum: '$totalPrice' }
          }
        }
      ]),

      // Delivered orders count
      Order.countDocuments({ orderStatus: 'delivered' }),

      // Total orders count
      Order.countDocuments(),

      // Cancelled orders count
      Order.countDocuments({ orderStatus: 'cancelled' }),

      // Sales chart data (last 12 months) - chỉ lấy đơn đã thanh toán
      Order.aggregate([
        {
          $match: {
            isPaid: true,
            paidAt: { $gte: twelveMonthsAgo }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$paidAt' },
              month: { $month: '$paidAt' }
            },
            revenue: { $sum: '$totalPrice' },
            orders: { $sum: 1 }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 }
        }
      ]),

      // Top selling products - chỉ lấy đơn đã thanh toán
      Order.aggregate([
        {
          $match: {
            isPaid: true,
            paidAt: { $gte: twelveMonthsAgo }
          }
        },
        {
          $unwind: '$orderItems'
        },
        {
          $lookup: {
            from: 'products',
            localField: 'orderItems.product',
            foreignField: '_id',
            as: 'product'
          }
        },
        {
          $unwind: '$product'
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'product.categories',
            foreignField: '_id',
            as: 'category'
          }
        },
        {
          $group: {
            _id: '$orderItems.product',
            name: { $first: '$product.name' },
            category: { $first: { $arrayElemAt: ['$category.name', 0] } },
            image: { $first: { $arrayElemAt: ['$product.images', 0] } },
            totalSold: { $sum: '$orderItems.quantity' },
            revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } }
          }
        },
        {
          $sort: { totalSold: -1 }
        },
        {
          $limit: 5
        }
      ]),

      // Order statistics by status - LẤY TẤT CẢ ĐƠN HÀNG, không lọc isPaid hay paidAt
      Order.aggregate([
        {
          $group: {
            _id: '$orderStatus',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        }
      ])
    ])

    // Process today's sales
    const todaySales = todaySalesResult.length > 0 ? todaySalesResult[0].totalSales : 0

    // Process sales chart data
    const salesChart: SalesChartData[] = salesChartData.map((item: any) => ({
      month: getMonthName((item as any)._id.month),
      revenue: (item as any).revenue,
      orders: (item as any).orders
    }))

    // Process top products
    const topProducts: TopProduct[] = topProductsData.map((item: any) => ({
      _id: item._id.toString(),
      name: item.name,
      category: item.category || 'Uncategorized',
      image: item.image || '',
      totalSold: item.totalSold,
      revenue: item.revenue
    }))

    // Process order statistics
    const totalOrderCount = totalOrders
    const orderStats: OrderStat[] = orderStatsData.map((item: any) => ({
      status: item._id,
      count: item.count,
      percent: totalOrderCount > 0 ? Math.round((item.count / totalOrderCount) * 100) : 0,
      color: getStatusColor(item._id)
    }))

    // Calculate rates
    const conversionRate = 85 // Hardcoded for now, can be enhanced with analytics
    const completionRate = totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 0

    const dashboardData: DashboardData = {
      lowStockCount,
      todaySales,
      deliveredOrders,
      conversionRate,
      completionRate,
      cancelledOrders,
      salesChart,
      topProducts,
      orderStats
    }

    res.status(200).json({
      success: true,
      data: dashboardData
    })
  } catch (error: unknown) {
    console.error('Error fetching dashboard summary:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard summary',
      error: (error as Error).message
    })
  }
}

// Individual dashboard endpoints for specific metrics

export const getLowStockProducts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const lowStockProducts = await Product.find({
      $or: [{ 'sizes.stock': { $lt: 5 } }, { status: 'out_of_stock' }]
    })
      .populate('categories', 'name')
      .populate('brand', 'name')
      .select('name price stockQuantity status images')
      .limit(10)

    res.status(200).json({
      success: true,
      data: {
        count: lowStockProducts.length,
        products: lowStockProducts
      }
    })
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: 'Error fetching low stock products',
      error: (error as Error).message
    })
  }
}

export const getTodaySales = async (_req: Request, res: Response): Promise<void> => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const result = await Order.aggregate([
      {
        $match: {
          paidAt: { $gte: today, $lt: tomorrow },
          isPaid: true
        }
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$totalPrice' },
          orderCount: { $sum: 1 }
        }
      }
    ])

    const data = result.length > 0 ? result[0] : { totalSales: 0, orderCount: 0 }

    res.status(200).json({
      success: true,
      data: {
        sales: data.totalSales,
        orders: data.orderCount,
        date: today.toISOString().split('T')[0]
      }
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching today sales',
      error: error.message
    })
  }
}

export const getOrderStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Calculate 12 months ago for filtering
    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11)
    twelveMonthsAgo.setDate(1)
    twelveMonthsAgo.setHours(0, 0, 0, 0)

    const stats = await Order.aggregate([
      {
        $match: {
          paidAt: { $gte: twelveMonthsAgo },
          isPaid: true
        }
      },
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ])

    const totalOrders = stats.reduce((sum, stat) => sum + stat.count, 0)

    const orderStats: OrderStat[] = stats.map((stat: any) => ({
      status: stat._id,
      count: stat.count,
      percent: totalOrders > 0 ? Math.round((stat.count / totalOrders) * 100) : 0,
      color: getStatusColor(stat._id)
    }))

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        stats: orderStats
      }
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order statistics',
      error: error.message
    })
  }
}

export const getTopSellingProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 5
    const days = parseInt(req.query.days as string) || 30

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const topProducts = await Order.aggregate([
      {
        $match: {
          paidAt: { $gte: startDate },
          isPaid: true
        }
      },
      {
        $unwind: '$orderItems'
      },
      {
        $lookup: {
          from: 'products',
          localField: 'orderItems.product',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $unwind: '$product'
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'product.categories',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $group: {
          _id: '$orderItems.product',
          name: { $first: '$product.name' },
          category: { $first: { $arrayElemAt: ['$category.name', 0] } },
          image: { $first: { $arrayElemAt: ['$product.images', 0] } },
          totalSold: { $sum: '$orderItems.quantity' },
          revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } }
        }
      },
      {
        $sort: { totalSold: -1 }
      },
      {
        $limit: limit
      }
    ])

    const formattedProducts: TopProduct[] = topProducts.map((item: any) => ({
      _id: item._id.toString(),
      name: item.name,
      category: item.category || 'Uncategorized',
      image: item.image || '',
      totalSold: item.totalSold,
      revenue: item.revenue
    }))

    res.status(200).json({
      success: true,
      data: {
        period: `${days} days`,
        products: formattedProducts
      }
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching top selling products',
      error: error.message
    })
  }
}

export const getSalesChart = async (req: Request, res: Response): Promise<void> => {
  try {
    const months = parseInt(req.query.months as string) || 12
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - months + 1)
    startDate.setDate(1)
    startDate.setHours(0, 0, 0, 0)

    const salesData = await Order.aggregate([
      {
        $match: {
          paidAt: { $gte: startDate },
          isPaid: true
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$paidAt' },
            month: { $month: '$paidAt' }
          },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ])

    const salesChart: SalesChartData[] = salesData.map((item: any) => ({
      month: getMonthName(item._id.month),
      revenue: item.revenue,
      orders: item.orders
    }))

    res.status(200).json({
      success: true,
      data: {
        period: `${months} months`,
        chart: salesChart
      }
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sales chart data',
      error: error.message
    })
  }
}

export const getPublicTopSellingProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 5
    const days = parseInt(req.query.days as string) || 30
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const topProducts = await Order.aggregate([
      { $match: { paidAt: { $gte: startDate }, isPaid: true } },
      { $unwind: '$orderItems' },
      {
        $lookup: {
          from: 'products',
          localField: 'orderItems.product',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $lookup: {
          from: 'categories',
          localField: 'product.categories',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $group: {
          _id: '$orderItems.product',
          name: { $first: '$product.name' },
          category: { $first: { $arrayElemAt: ['$category.name', 0] } },
          image: { $first: { $arrayElemAt: ['$product.images', 0] } },
          totalSold: { $sum: '$orderItems.quantity' },
          revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: limit }
    ])

    const formattedProducts = topProducts.map((product: any) => ({
      _id: product._id.toString(),
      name: product.name,
      image: product.image || '',
      totalQuantity: product.totalSold,
      totalRevenue: product.revenue,
      category: product.category || 'Uncategorized'
    }))

    res.status(200).json({
      success: true,
      data: formattedProducts
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching top selling products',
      error: error.message
    })
  }
}
