import DateRangePicker from "@/components/DateRangePicker";
import { useBudgetStore } from "@/state";
import { lastDayOfMonth } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";

export default function Categories(){
    const today = new Date();
    const fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const toDate = lastDayOfMonth(today);
    const [date, setDate] = useState<DateRange | undefined>({
        from: fromDate,
        to: toDate,
    })
    const transactions = useBudgetStore(state => state.transactions);
    const categories = useBudgetStore(state => state.categories);
    return <div className="w-full">
        <div className="flex justify-center">
            <DateRangePicker className="" date={date} setDate={setDate} />
        </div>
        <div className="w-full h-full overflow-y-auto">
            {/* Expense title w/ summed amount */}
            <div className="flex justify-center">
                <p>Expense $</p>
            </div>
            {/* Card for each expense category */}
                {/* Name */}
                {/* Icon/Color */}
                {/* Summed Amount */}
            {/* Income title w/ summed amount */}
            <div className="flex justify-center">
                <p>Income $</p>
            </div>
            {/* Card for each income category */}
                {/* Name */}
                {/* Icon/Color */}
                {/* Summed Amount */}
        </div>
    </div>
}