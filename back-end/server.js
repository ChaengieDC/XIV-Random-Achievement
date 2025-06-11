// SERVER.JS = Configuration du SERVEUR
/* --------------------------------- */

// Configuration du serveur Express
const dotenv = require('dotenv');
const express = require('express');
const session = require('express-session');
const path = require('path');

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(express.static(path.join(__dirname, '../front-end')));
app.use('/font', express.static(path.join(__dirname, '../data/font')));
app.use('/img', express.static(path.join(__dirname, '../data/img')));


// Requêtes de type GET
// Requête GET pour récupérer un haut fait aléatoire dans la liste reçue
app.get('/getRandomAchievement', (req, res) =>{
    const randomAchievements = req.session.randomAchievements;
    
    // Tableau des hauts faits déjà tirés dans la liste reçue
    if(!req.session.drawnAchievements){
        req.session.drawnAchievements = [];
    }

    const drawnIDs = new Set(req.session.drawnAchievements.map(a => a.id));
    // Filtrage des hauts faits pas encore tirés
    const remainingIDs = randomAchievements.filter(ach => !drawnIDs.has(ach.id));

    // Cas où tous les hauts faits de la liste ont été tirés
    if(remainingIDs.length === 0){
        return res.status(200).json({ exhausted: true });
    }

    // Sélectionne un haut fait aléatoire dans la liste
    const randomID = Math.floor(Math.random() * remainingIDs.length);
    const randomAchievement = remainingIDs[randomID];

    // On le sauvegarde dans la session
    req.session.drawnAchievements.push(randomAchievement);

    res.json(randomAchievement);
});


// Requêtes de type POST
// Requête POST pour récupérer une liste de hauts faits aléatoires
app.post('/getListOfRandomAchievements', async(req, res) =>{
    try{
        const lang = req.body.lang;
        const charaID = req.body.charaID;

        // Requête pour récupérer tous les hauts faits disponibles
        const allAchievementsResponse = await fetch(`https://ffxivcollect.com/api/achievements?language=${lang}`);
        const allAchievementsData = await allAchievementsResponse.json();
        // Requête pour récupérer les hauts faits possédés par l'utilisateur
        const userAchievementsResponse = await fetch(`https://ffxivcollect.com/api/characters/${charaID}/achievements/owned?language=${lang}`);
        // On vérifie si on obtient un résultat
        if(!userAchievementsResponse.ok){
            res.json({ success: false });
            return;
        }
        const userAchievementsData = await userAchievementsResponse.json();

        const ownedAchievementIDs = new Set(userAchievementsData.map(achievement => achievement.id));
        const excludedTypes = ["Legacy", "レガシー"];
        const excludedCategories = ["Événements saisonniers", "Seasonal Events", "Saisonale Ereignisse", "シーズナルイベント"];
        // Filtre pour exclure les types, catégories et garder uniquement les hauts faits que l'utilisateur ne possède pas
        const missingAchievements = allAchievementsData.results.filter(achievement =>{
            return (!excludedTypes.includes(achievement.type.name) && !excludedCategories.includes(achievement.category.name) && !ownedAchievementIDs.has(achievement.id) && achievement.owned !== "0%");
        });

        // Calcule 10 IDs aléatoires parmi les hauts faits filtrés
        let randomAchievements = [];
        while(randomAchievements.length < 10 && missingAchievements.length > 0){
            const randomID = Math.floor(Math.random() * missingAchievements.length);
            const randomAchievement = missingAchievements[randomID];

            // Pour insérer uniquement des hauts faits non ajoutés
            if(!randomAchievements.includes(randomAchievement)){
                randomAchievements.push(randomAchievement);
            }
        }

        // Stocke la liste des 10 hauts faits dans la session
        req.session.randomAchievements = randomAchievements;

        res.json(randomAchievements);
    } catch(error){
        console.error(error);
        res.status(500).send(`Erreur lors de la récupération des hauts faits: ${error}`);
    }
});


app.listen(3001, () =>{
    console.log("App is running...");
});