export type menus = {
    id: number | null;
    name: string;
    path: string;
    component: string;
    icon?: string;
    parent_id?: number | null;
    hidden: boolean;
    sort_order: number;
    children?: menus[];
  }

