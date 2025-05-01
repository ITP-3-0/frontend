export default async function handler(req, res) {
    if (req.method === "POST") {
        const { name, email, issue } = req.body;

        // Handle form data (e.g., send email or store in DB)
        console.log(`Received support request: ${name}, ${email}, ${issue}`);
        res.status(200).json({ message: "Form submitted successfully!" });
    }
}
