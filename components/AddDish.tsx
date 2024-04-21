import { Copy, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "./ui/textarea"

export function AddDishForm() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
            <Plus className="mr-2 h-4 w-4"/> Dish
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Dish</DialogTitle>
          <DialogDescription>
            Please fill all the information bellow .
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 items-center space-x-2">
            <div className="grid grid-cols-1 w-full space-y-2">
                <Label>Name</Label>
                <Input placeholder="Dish name" />
            </div>
            <div className="grid grid-cols-1 w-full space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Dish description" />
            </div>
            <div className="grid grid-cols-1 w-full space-y-2">
                <Label>Image</Label>
                <Input placeholder="Dish image url" />
            </div>
          {/* <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue="https://ui.shadcn.com/docs/installation"
              readOnly
            />
          </div>
          <Button type="submit" size="sm" className="px-3">
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button> */}
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button">
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
