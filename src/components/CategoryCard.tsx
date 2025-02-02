import { Category } from "@/state";
import { DynamicIcon } from "lucide-react/dynamic";
import { Card } from "./ui/card";

export default function CategoryCard({ category, amount }:{ category: Category, amount: number }){
    return <Card>
        <p>{category.name}</p>
        {/* @ts-ignore */}
        <div className={`${category.color}`}><DynamicIcon name={category.name} /></div>
        <p>${amount}</p>
    </Card>
}