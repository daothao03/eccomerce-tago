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
        screens: {
            xl: { max: "1200px" },
            lg: { max: "1080px" },
            "md-lg": { max: "991px" },
            md: { max: "768px" },
            sm: { max: "576px" },
            xs: { max: "480px" },
            "2xs": { max: "340px" },
        },
    },
    plugins: [],
};
