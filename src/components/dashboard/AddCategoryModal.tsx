'use client'

import { useState, useEffect } from 'react'
import {
    Dialog, DialogTrigger, DialogContent,
    DialogHeader, DialogFooter, DialogTitle, DialogDescription
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supaBaseClient'

export default function AddCategoryModal({ open, onClose }: { open: boolean, onClose: () => void }) {
    const [form, setForm] = useState({ name: '', type: 'expense' })

    const [categories, setCategories] = useState<{ name: string; type: string }[]>([])

    useEffect(() => {
        const fetchCategories = async () => {
            const { data, error } = await supabase.from('categories').select('name, type')
            if (!error && data) {
                setCategories(data)
            }
        }

        if (open) fetchCategories()
    }, [open])
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
            onClose()
        } catch (err) {
            console.error(err)
            toast.error('Add category function is not available')
        }
    }


    return (
        <Dialog open={open} onOpenChange={(state) => !state && onClose()}>
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
                <div className="mt-4 border-t pt-3">
                    <p className="text-sm font-semibold mb-2 text-muted-foreground">Existing Categories:</p>
                    <div className="max-h-32 overflow-y-auto space-y-1 text-sm">
                        {categories.length === 0 ? (
                            <p className="text-muted-foreground italic">No categories yet.</p>
                        ) : (
                            <>
                                {['expense', 'income'].map((type) => (
                                    <div key={type}>
                                        <p className="font-medium text-muted-foreground mt-2">{type === 'expense' ? 'Expenses' : 'Income'}:</p>
                                        <ul className="list-disc ml-5">
                                            {categories
                                                .filter((c) => c.type === type)
                                                .map((cat, idx) => (
                                                    <li key={idx}>{cat.name}</li>
                                                ))}
                                        </ul>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>


                <DialogFooter>
                    <Button onClick={handleSubmit}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
