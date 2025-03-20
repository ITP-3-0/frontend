export const addNotificationHandler = async (formData, toast, setFormData, setIsLoading) => {
    if (!formData.title.trim() || !formData.message.trim()) {
        toast({
            title: "Error",
            description: "Title and message are required",
            variant: "destructive",
        });
        return false;
    }

    if (formData.targetRoles.length === 0 && formData.targetUsers.length === 0) {
        toast({
            title: "Error",
            description: "Please select at least one target role or user",
            variant: "destructive",
        });
        return false;
    }

    setIsLoading(true);
    try {
        const response = await fetch("/api/notifications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            toast({
                title: "Success",
                description: "Notification sent successfully!",
                variant: "default",
            });
            setFormData({
                title: "",
                message: "",
                type: "system",
                priority: "medium",
                targetUsers: [],
                targetRoles: [],
                isEmailable: false,
            });
        } else {
            toast({
                title: "Error",
                description: "Failed to send notification",
                variant: "destructive",
            });
        }
    } catch (error) {
        console.error("Error adding notification:", error);
        toast({
            title: "Error",
            description: "An unexpected error occurred",
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
};
