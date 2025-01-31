import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Outlet, useLocation, useNavigate } from "react-router";
import { LayoutGrid, Settings, CalendarDays, ChartPie } from "lucide-react";
import { useBudgetStore } from "@/state";
import { UrlDialog } from "@/components/UrlDialog";

export default function Home(){
    const budgetUrl = useBudgetStore(state => state.budgetUrl);
    const navigate = useNavigate();
    return <>
      {!budgetUrl && <UrlDialog />}
      <Tabs defaultValue="categories"  onValueChange={(value) => { navigate(`/${value}`) }}>
        <Outlet />
        <TabsList className="w-full h-min fixed bottom-0">
          <TabsTrigger className="w-full" value="categories"><div className="flex flex-col items-center text-xs"><LayoutGrid size={20} /><span>Home</span></div></TabsTrigger>
          <TabsTrigger className="w-full" value="transactions"><div className="flex flex-col items-center text-xs"><CalendarDays size={20} />Transactions</div></TabsTrigger>
          <TabsTrigger className="w-full" value="budget"><div className="flex flex-col items-center text-xs"><ChartPie size={20} />Budget</div></TabsTrigger>
          <TabsTrigger className="w-full" value="settings"><div className="flex flex-col items-center text-xs"><Settings size={20} />Settings</div></TabsTrigger>
        </TabsList>
      </Tabs> 
    </>
}