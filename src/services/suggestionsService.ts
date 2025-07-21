import fs from 'fs';
import path from 'path';

export interface DocumentNode {
  title: string;
  content: string;
  tags: string[];
  children?: DocumentNode[];
}

export interface SuggestionsResponse {
  suggestions: string[];
  path: string;
}

class SuggestionsService {
  private tree: DocumentNode[] = [];
  private nodeMap: Map<string, DocumentNode> = new Map();

  /**
   * Xây dựng cây từ array JSON theo thứ tự preorder
   */
  private buildTree(documents: any[]): DocumentNode[] {
    const tree: DocumentNode[] = [];
    const stack: DocumentNode[] = [];

    for (const doc of documents) {
      const node: DocumentNode = {
        title: doc.title,
        content: doc.content,
        tags: doc.tags,
        children: []
      };

      // Lưu node vào map để tìm kiếm nhanh
      this.nodeMap.set(doc.title, node);

      // Nếu stack rỗng hoặc node hiện tại không phải con của node trên cùng stack
      // thì đây là node cấp 1
      if (stack.length === 0 || !this.isChildOf(doc.title, stack[stack.length - 1].title)) {
        tree.push(node);
        stack.length = 0; // Clear stack
        stack.push(node);
      } else {
        // Tìm parent phù hợp trong stack
        while (stack.length > 0 && !this.isChildOf(doc.title, stack[stack.length - 1].title)) {
          stack.pop();
        }
        
        if (stack.length > 0) {
          stack[stack.length - 1].children!.push(node);
          stack.push(node);
        } else {
          // Fallback: thêm vào root nếu không tìm thấy parent
          tree.push(node);
          stack.push(node);
        }
      }
    }

    return tree;
  }

  /**
   * Kiểm tra xem title có phải là con của parentTitle không
   * Dựa trên logic phân cấp: "Tôi muốn mua sản phẩm cho Nam" là con của "Tôi muốn mua sản phẩm"
   */
  private isChildOf(title: string, parentTitle: string): boolean {
    // Nếu parent là "Tôi muốn mua sản phẩm" và title bắt đầu bằng parent + " cho"
    if (parentTitle === "Tôi muốn mua sản phẩm" && title.startsWith(parentTitle + " cho")) {
      return true;
    }
    
    // Nếu parent là "Tôi muốn mua sản phẩm cho Nam" và title bắt đầu bằng "Tôi muốn mua sản phẩm của"
    if (parentTitle === "Tôi muốn mua sản phẩm cho Nam" && title.startsWith("Tôi muốn mua sản phẩm của")) {
      return true;
    }
    
    if (parentTitle === "Tôi muốn mua sản phẩm cho Nữ" && title.startsWith("Tôi muốn mua sản phẩm của")) {
      return true;
    }
    
    if (parentTitle === "Tôi muốn mua sản phẩm cho Trẻ em" && title.startsWith("Tôi muốn mua sản phẩm của")) {
      return true;
    }

    // Nếu parent là "Tôi muốn mua sản phẩm của Arsenal" và title bắt đầu bằng "Tôi muốn mua áo đấu Arsenal"
    if (parentTitle.includes("Tôi muốn mua sản phẩm của") && title.startsWith("Tôi muốn mua áo đấu")) {
      return true;
    }

    // Các trường hợp khác: chính sách, hướng dẫn, thông tin thương hiệu
    if (parentTitle === "Tôi muốn mua sản phẩm") {
      const policyKeywords = ["Chính sách", "Hướng dẫn", "Cách", "Phương thức", "Theo dõi", "Tôi muốn biết về"];
      return policyKeywords.some(keyword => title.startsWith(keyword));
    }

    return false;
  }

  /**
   * Khởi tạo service, đọc file JSON và xây dựng cây
   */
  public initialize(): void {
    try {
      const dataPath = path.resolve(__dirname, '../data/document.json');
      if (!fs.existsSync(dataPath)) {
        throw new Error('File document.json không tồn tại!');
      }

      const documents = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
      this.tree = this.buildTree(documents);
      console.log('✅ Suggestions tree built successfully');
    } catch (error) {
      console.error('❌ Error initializing suggestions service:', error);
      throw error;
    }
  }

  /**
   * Tìm node theo path
   */
  private findNodeByPath(pathArray: string[]): DocumentNode | null {
    if (pathArray.length === 0) {
      return null;
    }

    let currentLevel = this.tree;
    
    for (const title of pathArray) {
      const found = currentLevel.find(node => node.title === title);
      if (!found) {
        return null;
      }
      
      if (pathArray[pathArray.length - 1] === title) {
        return found; // Đây là node cuối cùng trong path
      }
      
      currentLevel = found.children || [];
    }

    return null;
  }

  /**
   * Lấy suggestions theo path
   */
  public getSuggestions(pathString: string = ""): SuggestionsResponse {
    const pathArray = pathString ? pathString.split('|') : [];
    
    if (pathArray.length === 0) {
      // Trả về các node cấp 1
      const suggestions = this.tree.map(node => node.title);
      return {
        suggestions,
        path: ""
      };
    }

    // Tìm node theo path
    const node = this.findNodeByPath(pathArray);
    if (!node) {
      throw new Error('Path not found');
    }

    // Trả về children của node
    const suggestions = (node.children || []).map(child => child.title);
    return {
      suggestions,
      path: pathString
    };
  }

  /**
   * Lấy toàn bộ cây (cho debug)
   */
  public getTree(): DocumentNode[] {
    return this.tree;
  }
}

// Export singleton instance
export const suggestionsService = new SuggestionsService(); 