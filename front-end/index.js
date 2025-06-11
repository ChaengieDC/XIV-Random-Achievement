// JS du SITE
/* ------- */

document.querySelectorAll("#logoMini, .home").forEach(element =>{
    element.addEventListener("click", () =>{
        location.reload();
    });
});

let selectedLanguage = null;

// Fonction pour changer certaines informations selon la langue choisie
function updateInfo(language){
    const languages = {
        fr: {
            placeholder: "ID PERSONNAGE",
            error: "Personnage introuvable ou privé.",
            buttons: ["COMMENCER", "SUIVANT", "RELANCER", "RECOMMENCER"],
            gradient: "linear-gradient(45deg, #ff002b, #ff75dc)",
            boxShadow: "0 0 20px rgba(255, 0, 43, 0.5), 0 0 40px rgba(255, 117, 220, 0.3)",
            hoverShadow: "0 0 40px rgba(255, 0, 43, 0.7), 0 0 80px rgba(255, 117, 220, 0.5)"
        },
        en: {
            placeholder: "CHARACTER ID",
            error: "Character not found or private.",
            buttons: ["START", "NEXT", "REROLL", "RESTART"],
            gradient: "linear-gradient(45deg, #ff75dc, #5d02ff)",
            boxShadow: "0 0 20px rgba(255, 117, 220, 0.5), 0 0 40px rgba(93, 2, 255, 0.3)",
            hoverShadow: "0 0 40px rgba(255, 117, 220, 0.7), 0 0 80px rgba(93, 2, 255, 0.5)"
        },
        de: {
            placeholder: "CHARAKTER ID",
            error: "Charakter nicht gefunden oder privat.",
            buttons: ["STARTEN", "WEITER", "NEU ZIEHEN", "NEU STARTEN"],
            gradient: "linear-gradient(45deg, #5d02ff, #00bcd4)",
            boxShadow: "0 0 20px rgba(93, 2, 255, 0.5), 0 0 40px rgba(0, 188, 212, 0.3)",
            hoverShadow: "0 0 40px rgba(93, 2, 255, 0.7), 0 0 80px rgba(0, 188, 212, 0.5)"
        },
        ja: {
            placeholder: "キャラクターID",
            error: "キャラクターが見つからないか非公開。",
            buttons: ["スタート", "次へ", "再抽選", "リスタート"],
            gradient: "linear-gradient(45deg, #00bcd4, #89ff00)",
            boxShadow: "0 0 20px rgba(0, 188, 212, 0.5), 0 0 40px rgba(137, 255, 0, 0.3)",
            hoverShadow: "0 0 40px rgba(0, 188, 212, 0.7), 0 0 80px rgba(137, 255, 0, 0.5)"
        }
    };

    const langData = languages[language];

    document.querySelector("#characterID").placeholder = langData.placeholder;
    document.querySelector(".error-text").textContent = langData.error;

    const buttons = [
        { id: "#startButton", text: langData.buttons[0], applyShadow: true },
        { id: "#nextButton", text: langData.buttons[1] },
        { id: "#rerollButton", text: langData.buttons[2] },
        { id: "#restartButton", text: langData.buttons[3] }
    ];

    buttons.forEach(({ id, text, applyShadow }) =>{
        const btn = document.querySelector(id);
        btn.textContent = text;
        btn.style.background = langData.gradient;
        btn.style.boxShadow = applyShadow ? langData.boxShadow : "none";

        btn.addEventListener("mouseover", () =>{
            btn.style.boxShadow = langData.hoverShadow;
        });
        btn.addEventListener("mouseout", () =>{
            btn.style.boxShadow = applyShadow ? langData.boxShadow : "none";
        });
    });
}

function clearAchievements(){
    const randomAchievement = document.querySelector(".random-achievement");
    while(randomAchievement.children.length > 0){
        randomAchievement.removeChild(randomAchievement.firstChild);
    }
}

function generateListOfRandomAchievements(){
    const inputValue = characterID.value;

    const containerAchievement = document.querySelector(".container-achievement");
    containerAchievement.style.display = "grid";

    fetch("/getListOfRandomAchievements", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lang: selectedLanguage, charaID: inputValue })
        })
        .then(response =>{
            return response.json();
        })
        .then(data =>{
            // Si l'ID du personnage est invalide
            if(data.success === false){
                document.querySelector(".error-text").style.display = "block";
                return;
            }

            // On cache les éléments précédents
            document.querySelector(".input-wrapper").classList.add("hidden");
            startButton.classList.add("hidden");

            // On cache les éléments pour refaire une nouvelle génération
            document.querySelector(".random-achievement").style.display = "none";
            document.querySelector(".reroll-buttons").style.display = "none";

            containerAchievement.innerHTML = ""; // Réinitialise le contenu

            data.forEach((achievement, index) =>{
                const achievementCard = document.createElement("div");
                achievementCard.className = "achievement-card hidden";

                const achievementCardContent = document.createElement("div");
                achievementCardContent.className = "achievement-card-content";

                const achievementInfo = document.createElement("div");
                achievementInfo.className = "achievement-info";

                const icon = document.createElement("img");
                icon.src = achievement.icon;
                icon.alt = achievement.name;
                icon.width = 50;
                icon.height = 50;

                const infoWrapper = document.createElement("div");
                infoWrapper.className = "info-wrapper";

                const title = document.createElement("h3");
                title.textContent = achievement.name;

                const description = document.createElement("p");
                description.textContent = achievement.description;

                const hr = document.createElement("hr");

                const achievementCategory = document.createElement("div");
                achievementCategory.className = "achievement-category";

                const type = document.createElement("p");
                type.textContent = achievement.type.name;

                const category = document.createElement("p");
                category.textContent = achievement.category.name;

                infoWrapper.appendChild(title);
                infoWrapper.appendChild(description);
                achievementInfo.appendChild(icon);
                achievementInfo.appendChild(infoWrapper);
                achievementCategory.appendChild(type);
                achievementCategory.appendChild(category);
                achievementCardContent.appendChild(achievementInfo);
                achievementCardContent.appendChild(hr);
                achievementCardContent.appendChild(achievementCategory);
                achievementCard.appendChild(achievementCardContent);

                // Animation de fade-in avec un décalage pour chaque haut fait
                setTimeout(() =>{
                    containerAchievement.classList.remove("hidden");
                    achievementCard.classList.remove("hidden");
                    achievementCard.classList.add("achievement-fade-in");

                    // Si c'est le dernier élément, on affiche le bouton
                    if(index === data.length - 1){
                        const nextButton = document.querySelector("#nextButton");
                        nextButton.classList.remove("hidden", "show");
                        nextButton.style.display = "block";

                        setTimeout(() =>{
                            nextButton.classList.add("show");
                        }, 300);
                    }
                }, index * 300);

                containerAchievement.appendChild(achievementCard);
            });
        })
        .catch(error =>{
            console.error(`Une erreur est survenue lors de la génération des hauts faits: ${error}`);
        });
}
function generateRandomAchievement(){
    const randomAchievement = document.querySelector(".random-achievement");
    randomAchievement.style.display = "block";
    document.querySelector(".reroll-buttons").style.display = "flex";

    fetch("/getRandomAchievement")
        .then(response =>{
            return response.json();
        })
        .then(data =>{
            // Si c'est le dernier élément, on empêche l'action du bouton de relance
            if(data.exhausted){
                const rerollButton = document.querySelector("#rerollButton");
                rerollButton.setAttribute("disabled", true);
                rerollButton.style.opacity = "50%";
                return;
            }

            clearAchievements();

            // On cache les éléments précédents
            document.querySelector(".container-achievement").classList.add("hidden");
            document.querySelector("#nextButton").classList.add("hidden");

            // Pour pouvoir rejouer l'animation des boutons plus tard
            const rerollButton = document.querySelector("#rerollButton");
            const restartButton = document.querySelector("#restartButton");
            rerollButton.classList.remove("show");
            rerollButton.classList.add("hidden");
            restartButton.classList.remove("show");
            restartButton.classList.add("hidden");
            
            const achievementCard = document.createElement("div");
            achievementCard.className = "achievement-card hidden";

            const achievementCardContent = document.createElement("div");
            achievementCardContent.className = "achievement-card-content";

            const achievementInfo = document.createElement("div");
            achievementInfo.className = "achievement-info";

            const icon = document.createElement("img");
            icon.src = data.icon;
            icon.alt = data.name;
            icon.width = 50;
            icon.height = 50;

            const infoWrapper = document.createElement("div");
            infoWrapper.className = "info-wrapper";

            const title = document.createElement("h3");
            title.textContent = data.name;

            const description = document.createElement("p");
            description.textContent = data.description;

            const hr = document.createElement("hr");

            const achievementCategory = document.createElement("div");
            achievementCategory.className = "achievement-category";

            const type = document.createElement("p");
            type.textContent = data.type.name;

            const category = document.createElement("p");
            category.textContent = data.category.name;

            infoWrapper.appendChild(title);
            infoWrapper.appendChild(description);
            achievementInfo.appendChild(icon);
            achievementInfo.appendChild(infoWrapper);
            achievementCategory.appendChild(type);
            achievementCategory.appendChild(category);
            achievementCardContent.appendChild(achievementInfo);
            achievementCardContent.appendChild(hr);
            achievementCardContent.appendChild(achievementCategory);
            achievementCard.appendChild(achievementCardContent);

            // Animation de fade-in avec un décalage du haut fait
            setTimeout(() =>{
                achievementCard.classList.remove("hidden");
                achievementCard.classList.add("achievement-fade-in");

                const rerollButton = document.querySelector("#rerollButton");
                rerollButton.classList.remove("hidden", "show");
                rerollButton.removeAttribute("disabled");
                rerollButton.style.display = "block";
                rerollButton.style.opacity = "";

                setTimeout(() =>{
                    rerollButton.classList.add("show");
                    const restartButton = document.querySelector("#restartButton");
                    restartButton.classList.remove("hidden", "show");
                    restartButton.style.display = "block";

                    setTimeout(() =>{
                        restartButton.classList.add("show");
                    }, 300);
                }, 300);
            }, 300);

            randomAchievement.appendChild(achievementCard);
        })
        .catch(error =>{
            console.error(`Une erreur est survenue lors de la génération du haut fait: ${error}`);
        });
}
document.addEventListener("DOMContentLoaded", () =>{
    const languageOptions = document.querySelectorAll(".language-options a");
    const containerStart = document.querySelector(".container-start");

    // Affiche la suite lorsqu'on sélectionne une langue
    languageOptions.forEach((option) =>{
        option.addEventListener("click", (event) =>{
            selectedLanguage = event.currentTarget.getAttribute("data-lang");

            updateInfo(selectedLanguage);

            // Cache le logo et les options de langue
            document.querySelector("#logo").classList.add("hidden");
            document.querySelector(".language-options").classList.add("hidden");

            // Animation de fade-in pour la génération
            containerStart.style.display = "flex";
            setTimeout(() =>{
                characterID.classList.add("show");
            }, 50);
        });
    });

    const characterID = document.querySelector("#characterID");
    const startButton = document.querySelector("#startButton");

    // Pour afficher ou masquer le bouton en fonction du contenu de l'input
    characterID.addEventListener("input", () =>{
        if(characterID.value.trim() !== ""){
            startButton.classList.add("show");
            startButton.removeAttribute("disabled");
        } else {
            startButton.classList.remove("show");
            startButton.setAttribute("disabled", "true");
        }
    });

    const nextButton = document.querySelector("#nextButton");
    const rerollButton = document.querySelector("#rerollButton");
    const restartButton = document.querySelector("#restartButton");

    // Bouton de génération
    startButton.addEventListener("click", () =>{
        generateListOfRandomAchievements();
    });

    // Bouton de suite de génération
    nextButton.addEventListener("click", () =>{
        generateRandomAchievement();
    });

    // Bouton de relance de génération
    rerollButton.addEventListener("click", () =>{
        generateRandomAchievement();
    });    
    // Bouton de nouvelle génération
    restartButton.addEventListener("click", () =>{
        generateListOfRandomAchievements();
    });
});