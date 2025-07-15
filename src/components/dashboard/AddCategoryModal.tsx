'use client'

import { useState } from 'react'
import {
    Dialog, DialogTrigger, DialogContent,
    DialogHeader, DialogFooter, DialogTitle, DialogDescription
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useBudget } from '@/lib/budget-store'
import { supabase } from '@/lib/supaBaseClient'

export default function AddCategoryModal() {
    const [open, setOpen] = useState(false)
    const [form, setForm] = useState({ name: '', type: 'expense' })

    const { addCategory } = useBudget()

    const handleSubmit = async () => {
        if (!form.name || !form.type) {
            toast.error('Please fill in all fields')
            return
        }

        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser()

            if (userError || !user) {
                throw new Error('User not authenticated')
            }

            const { error } = await supabase.from('categories').insert({
                name: form.name,
                type: form.type,
                user_id: user.id,
            })

            if (error) {
                console.error(error)
                toast.error('Failed to save category')
                return
            }

            toast.success(`Category "${form.name}" added`)
            setForm({ name: '', type: 'expense' })
            setOpen(false)
        } catch (err) {
            console.error(err)
            toast.error('Add category function is not available')
        }
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Add Category</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Category</DialogTitle>
                    <DialogDescription>
                        Create a new category for tracking expenses or income.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3">
                    <input
                        className="w-full border rounded p-2"
                        placeholder="Category Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    <select
                        className="w-full border rounded p-2"
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                    >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>
                </div>

                <DialogFooter>
                    <Button onClick={handleSubmit}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
