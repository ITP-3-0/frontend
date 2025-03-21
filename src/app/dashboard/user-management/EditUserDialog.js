"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useButton } from "@/app/Contexts/ButtonContext";
import { Spinner } from "@/components/ui/spinner";

export function EditUserDialog({ user, onClose, onSave }) {
    const { button, setButton } = useButton();

    const [formData, setFormData] = useState({
        id: "",
        username: "",
        censusNo: "",
        role: "user",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                id: user._id,
                username: user.username || "",
                censusNo: user.censusNo || "",
                role: user.role || "user",
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRoleChange = (value) => {
        setFormData((prev) => ({ ...prev, role: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onSave(formData);
            onClose();
            window.location.reload();
        } catch (error) {
            console.error("Error saving user:", error);
        }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>Update user information and role.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" name="username" value={formData.username} onChange={handleChange} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="censusNo">Census Number</Label>
                            <Input id="censusNo" name="censusNo" value={formData.censusNo} onChange={handleChange} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="role">Role</Label>
                            <Select value={formData.role} onValueChange={handleRoleChange}>
                                <SelectTrigger id="role">
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="client">User</SelectItem>
                                    <SelectItem value="agent_l1">Agent L1</SelectItem>
                                    <SelectItem value="agent_l2">Agent L2</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">{button ? <Spinner /> : "Save Changes"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
