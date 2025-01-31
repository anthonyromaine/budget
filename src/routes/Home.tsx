import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Outlet, useLocation, useNavigate } from "react-router";
import { LayoutGrid, Settings, CalendarDays, ChartPie } from "lucide-react";
import { useBudgetStore } from "@/state";
import { UrlDialog } from "@/components/UrlDialog";
import { useEffect, useState } from "react";
import { PropagateLoader } from "react-spinners";

export default function Home(){
    const budgetUrl = useBudgetStore(state => state.budgetUrl);
    const setBudgetUrl = useBudgetStore(state => state.setBudgetUrl);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {

      if(!budgetUrl){
        let urls = localStorage.getItem("urls");
        if (urls){
          setLoading(true);
          setBudgetUrl(JSON.parse(urls)).then(()=> setLoading(false));
        } else {
          setLoading(false);
        }
      }

    }, [budgetUrl])

    return loading ? <div className="w-full h-dvh flex flex-1 justify-center items-center"><PropagateLoader /></div> : <>
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