/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            backgroundColor: {
                primary: "#005D63",
                secondary: "#1E787D",
                admin: "#94b8b7",
            },
            borderColor: {
                primary: "#005D63",
                secondary: "#1E787D",
            },
            borderRadius: {
                999: "999px",
                custom: "25% 25% 46% 54% / 0% 0% 73% 72%",
            },
            fontFamily: {
                "roboto-slab": ["Roboto Slab", "serif"],
            },
        },
    },
    plugins: [],
};
