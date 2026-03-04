'use client'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Pencil,} from 'lucide-react'
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
import { useState } from "react"
import { email } from "zod"


export default function AccountDetails() {
    const [changeEmail, setChangeEmail] = useState('');
    const [openDialog, setOpenDialog ] = useState(false);

    const handleChangeEmail = (e)=> {
        e.preventDefault();

        console.log('changeEmail:', changeEmail);

    }

  return (
    <div>
         <Card className="w-full gap-2.5">
            <CardHeader>
                <CardTitle className='p-0'>Account Details</CardTitle>
            </CardHeader>
            <CardContent className='max-w-lg'>
                <Label htmlFor="email" className='mb-2'>Email</Label>
                <div className="flex gap-2 items-center">
                     <Input
                    type="email"
                    placeholder="ziauddinzoy@gmail.com"
                    onClick={()=> setOpenDialog(true)}
                    required
                    disabled
                    />
                    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                        <DialogTrigger asChild>
                        <Button variant="outline"><Pencil /></Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <form action="" className="flex gap-3 flex-col" onSubmit={handleChangeEmail}>
                                <DialogHeader>
                                    <DialogTitle>Change Your Email Address</DialogTitle>
                                    <DialogDescription>
                                    Enter your new email address. You will need to verify it before the change takes effect.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4">
                                    <div className="grid gap-3">
                                    <Label htmlFor="name-1">New Email</Label>
                                    <Input id="name-1" name="name" placeholder='Your new work email address'
                                        value={changeEmail}
                                        onChange={(e) => setChangeEmail(e.target.value)}
                                    />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                        <Button  type='submit'
                                        onClick={()=> setOpenDialog(false)}
                                        >Change Email</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
          <Card className="w-full gap-2.5 mt-6">
            <CardHeader className='max-w-xl'>
                <CardTitle className='p-0'>Dangerous Zone</CardTitle>
                <CardDescription>Please, pay attention, these actions are irreversible. Be careful when executing.</CardDescription>
                <CardDescription className='text-red-500'>
                    You can't delete and close the account as an organization owner when there is more than one member in the organization.
                    Ask them to delete their accounts first, or remove them from the organization.
                </CardDescription>
            </CardHeader>
            <CardContent className='max-w-lg'>
                <Button variant='destructive' disabled>Delete Account</Button>
            </CardContent>
        </Card>
    </div>
  )
}
