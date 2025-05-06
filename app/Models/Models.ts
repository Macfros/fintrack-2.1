export interface BillModel {
    id: string;
    name: string;
    category: string;
    amount: number;
    secure_url?: string;
    createdAt: string; 
    subItems: SubItemModel[];
    billImage?: File; 
}

export interface SubItemModel {
    id?: number;
    name: string;
    amount: number;
}


export interface TableItem {
    id :        String;
    name:        String;
    category:    String;
    amount:      number;
    secure_url?:  String;
    createdAt:   String;
    subitems:   SubItemModel[]
  }


    export interface BillSummaryModel {
    totalAmount: number;
    currentMonthAmount: {
        amount: number;
        comparison: string; // e.g., "12.34% more than last month"
    };
    mostSpentCategory: {
        category: string;
        total: number;
    };
    miscellaneousSpent: {
        amount: number;
        comparison: string; // e.g., "8.5% less than last month"
    };
    }


    export interface PieChartEntry {
        category: string;
        _sum: {
            amount: number | null;
        };
    }
    
    export interface MonthlyPieChartResponse {
        monthly: PieChartEntry[];
    }
    
    export interface YearlyPieChartResponse {
        yearly: PieChartEntry[];
    }


    export interface BarGraphResponse{
        data: number[];
    }