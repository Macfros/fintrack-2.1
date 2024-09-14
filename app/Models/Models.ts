

export interface BillModel {
    name: string;
    category: string;
    amount: number;
    date: Date;
    subItems: SubItemModel[];
}

export interface SubItemModel {
    id: number;
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