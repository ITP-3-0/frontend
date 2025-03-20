import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function Page(params) {
    const data = await fetch("http://localhost:5000/users");
    const users = await data.json();
    return (
        <Table>
            <TableCaption>A list of all users.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>User Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
