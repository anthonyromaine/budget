import * as React from "react"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useBudgetStore } from "@/state"

export function UrlDialog() {
  const [open, setOpen] = React.useState(true);
  const budgetUrl = useBudgetStore(state => state.budgetUrl);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  React.useEffect(() => {

  }, []);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={(change) => {
            if (!change && !budgetUrl){
              return;
            }
            setOpen(change);
        }}>
        {/* <DialogTrigger asChild>
          <Button variant="outline">Edit Profile</Button>
        </DialogTrigger> */}
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Set Budget URL</DialogTitle>
            <DialogDescription>
                Input your budget's url
            </DialogDescription>
          </DialogHeader>
          <UrlForm />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      {/* <DrawerTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DrawerTrigger> */}
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Set Budget URL</DrawerTitle>
          <DrawerDescription>
            Input your budget's url
          </DrawerDescription>
        </DrawerHeader>
        <UrlForm className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function UrlForm({ className }: React.ComponentProps<"form">) {
    const setBudgetUrl = useBudgetStore(state => state.setBudgetUrl);
  return (
    <form className={cn("grid items-start gap-4", className)} onSubmit={(e) => {
        e.preventDefault();
        let data = new FormData(e.target as HTMLFormElement);
        let budget = data.get("budget") as string;
        let transactions = data.get("transactions") as string;
        let categories = data.get("categories") as string;
        if (budget.trim() && transactions.trim() && categories.trim()){
          setBudgetUrl({ budget: budget.trim(), transactions: transactions.trim(), categories: categories.trim() });
        }
    }}>
      <div className="grid gap-2">
        <Label htmlFor="budget">Budget URL</Label>
        <Input type="budget" id="budget" defaultValue="" name="budget" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="transactions">Transactions URL</Label>
        <Input type="transactions" id="transactions" defaultValue="" name="transactions" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="categories">Categories URL</Label>
        <Input type="categories" id="categories" defaultValue="" name="categories" />
      </div>
      <Button type="submit">Save changes</Button>
    </form>
  )
}
