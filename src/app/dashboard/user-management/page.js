import { UserManagement } from "./UserManagement";

export default async function Page(params) {
    const data = await fetch("/api/users");
    const users = await data.json();
    return (
        <div className="container mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold ">User Management</h1>
            </div>

            <UserManagement props={users} />
        </div>
    );
}
