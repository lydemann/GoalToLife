
export interface Task {
    id: string;
    name: string;
    categories: string[];
    createdAt: Date;
    lastUpdated: Date;
    completed: boolean;
    subTasks: Task[];
}
