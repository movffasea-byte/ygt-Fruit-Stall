export type Review = {
  name: string;
  text: string;
  stars: number;
  date: string;
  about: string;
};

// Customer reviews from the shop's Instagram story highlights (screenshots supplied by the client).
export const reviews: Review[] = [
  {
    name: "Happy customer",
    text: "The juice was nice wallahi, if I can afford it I will be getting those shots daily, I love the peppery ginger taste. Also, the quencher is definitely my fav.",
    stars: 5,
    date: "August 2024",
    about: "The Quencher",
  },
  {
    name: "Kamrahscentsisle",
    text: "Your orange juice was a blast. It was really sweet, Masha Allah. It took a lot for me to be able to hold back on finishing the bottles at a go. Thank you for the wonderful experience.",
    stars: 5,
    date: "July 2024",
    about: "Orange juice",
  },
  {
    name: "Mrs",
    text: "Juices dai, I love them. They are not sweetened but still very delicious and refreshing, even my kids love them. I love they have pulp. Overall I will give them 8/10. Keep up the good work.",
    stars: 4,
    date: "April 2023",
    about: "Fresh juices",
  },
  {
    name: "Happy customer",
    text: "I just waited for your salad. Since I ate it and took the juice, wallahi in few hours I felt the impact.",
    stars: 5,
    date: "April 2023",
    about: "Salad and juice",
  },
  {
    name: "Happy customer",
    text: "Wallahi he loved it sosai, thanks so much darling, I really appreciate. Yaji dadi sosai.",
    stars: 5,
    date: "April 2023",
    about: "Salad gift box",
  },
];

export type Tip = {
  title: string;
  text: string;
  emoji: string;
  image?: string;
};

// "Did you know" posts from the shop's Instagram stories.
export const tips: Tip[] = [
  {
    title: "Broccoli",
    emoji: "🥦",
    image: "/gallery/tip-broccoli.webp",
    text: "A true nutritional superstar. High in vitamins K and C, plus fibre, it supports bone health and boosts your body's defence system.",
  },
  {
    title: "Tomatoes",
    emoji: "🍅",
    image: "/gallery/tip-tomatoes.webp",
    text: "Technically a fruit, not a vegetable! Packed with lycopene, a powerful antioxidant that supports heart health.",
  },
  {
    title: "Carrots",
    emoji: "🥕",
    image: "/gallery/tip-carrots.webp",
    text: "An excellent source of beta-carotene, which is essential for healthy vision. Also a great crunchy snack on the go.",
  },
  {
    title: "Acca (fonio)",
    emoji: "🌾",
    image: "/gallery/fonio-bowl.webp",
    text: "Did you know acca has a higher calcium content than any other grain? It is a staple in our salad bowls.",
  },
  {
    title: "Moringa",
    emoji: "🌿",
    text: "One of our best-selling greens for smoothies. A superfood powerhouse packed with goodness.",
  },
  {
    title: "Beetroot",
    emoji: "🫚",
    text: "The star of our Beetbliss: beetroot, carrot, apple, pineapple and orange, rich in iron and vitamins A and C.",
  },
];

export type KitchenPhoto = { src: string; label: string };

export const kitchen: KitchenPhoto[] = [
  { src: "/gallery/egg-salad.webp", label: "Egg salad" },
  { src: "/gallery/chicken-salad.webp", label: "Chicken salad" },
  { src: "/gallery/fonio-bowl.webp", label: "Fonio bowl" },
  { src: "/gallery/custom-blends.webp", label: "Custom blends" },
];
