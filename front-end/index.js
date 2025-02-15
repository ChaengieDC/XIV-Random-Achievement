// JS du SITE
/* ------- */

document.addEventListener("DOMContentLoaded", () =>{
    const languageOptions = document.querySelectorAll(".language-options a");
    const containerStart = document.querySelector(".container-start");
    const characterID = document.querySelector("#characterID");
    const startButton = document.querySelector("#startButton");
    const nextButton = document.querySelector("#nextButton");

    let selectedLanguage = null; // Stocke la langue choisie

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

    // Fonction pour changer certaines informations selon la langue choisie
    function updateInfo(language){
        let inputPlaceholder, errorText, startTextContent, btnGradient, btnBoxShadow, btnHoverBoxShadow, nextTextContent;

        switch(language){
            case "fr":
                inputPlaceholder = "ID PERSONNAGE";
                errorText = "Personnage introuvable ou privé."
                startTextContent = "DÉMARRER";
                btnGradient = "linear-gradient(45deg, #ff002b, #ff75dc)";
                btnBoxShadow = "0 0 20px rgba(255, 0, 43, 0.5), 0 0 40px rgba(255, 117, 220, 0.3)";
                btnHoverBoxShadow = "0 0 40px rgba(255, 0, 43, 0.7), 0 0 80px rgba(255, 117, 220, 0.5)";
                nextTextContent = "SUIVANT";
                break;
            case "en":
                inputPlaceholder = "CHARACTER ID";
                errorText = "Character not found or private."
                startTextContent = "START";
                btnGradient = "linear-gradient(45deg, #ff75dc, #5d02ff)";
                btnBoxShadow = "0 0 20px rgba(255, 117, 220, 0.5), 0 0 40px rgba(93, 2, 255, 0.3)";
                btnHoverBoxShadow = "0 0 40px rgba(255, 117, 220, 0.7), 0 0 80px rgba(93, 2, 255, 0.5)";
                nextTextContent = "NEXT";
                break;
            case "de":
                inputPlaceholder = "CHARAKTER ID";
                errorText = "Charakter nicht gefunden oder privat."
                startTextContent = "STARTEN";
                btnGradient = "linear-gradient(45deg, #5d02ff, #00bcd4)";
                btnBoxShadow = "0 0 20px rgba(93, 2, 255, 0.5), 0 0 40px rgba(0, 188, 212, 0.3)";
                btnHoverBoxShadow = "0 0 40px rgba(93, 2, 255, 0.7), 0 0 80px rgba(0, 188, 212, 0.5)";
                nextTextContent = "WEITER";
                break;
            case "ja":
                inputPlaceholder = "キャラクターID";
                errorText = "キャラクターが見つからないか非公開。"
                startTextContent = "スタート";
                btnGradient = "linear-gradient(45deg, #00bcd4, #89ff00)";
                btnBoxShadow = "0 0 20px rgba(0, 188, 212, 0.5), 0 0 40px rgba(137, 255, 0, 0.3)";
                btnHoverBoxShadow = "0 0 40px rgba(0, 188, 212, 0.7), 0 0 80px rgba(137, 255, 0, 0.5)";
                nextTextContent = "次へ";
                break;
        }

        document.querySelector("#characterID").placeholder = inputPlaceholder;
        document.querySelector(".error-text").textContent = errorText;
        startButton.textContent = startTextContent;
        startButton.style.background = btnGradient;
        startButton.style.boxShadow = btnBoxShadow;

        startButton.addEventListener("mouseover", () =>{
            startButton.style.boxShadow = btnHoverBoxShadow;
        });
        startButton.addEventListener("mouseout", () =>{
            startButton.style.boxShadow = btnBoxShadow;
        });

        nextButton.textContent = nextTextContent;
        nextButton.style.background = btnGradient;

        nextButton.addEventListener("mouseover", () =>{
            nextButton.style.boxShadow = btnHoverBoxShadow;
        });
        nextButton.addEventListener("mouseout", () =>{
            nextButton.style.boxShadow = "none";
        });

    }

    // Bouton de génération
    startButton.addEventListener("click", () =>{
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
                if(data.success === false){
                    document.querySelector(".error-text").style.display = "block";
                    return;
                }

                characterID.classList.add("hidden");
                document.querySelector(".input-wrapper").classList.add("hidden");
                startButton.classList.add("hidden");

                containerAchievement.innerHTML = ""; // Réinitialise le contenu

                data.forEach((achievement, index) =>{
                    const achievementCard = document.createElement("div");
                    achievementCard.className = "achievement-card hidden";

                    const achievementCardContent = document.createElement("div");
                    achievementCardContent.className = "achievement-card-content";

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

                    infoWrapper.appendChild(title);
                    infoWrapper.appendChild(description);
                    achievementCardContent.appendChild(icon);
                    achievementCardContent.appendChild(infoWrapper);
                    achievementCard.appendChild(achievementCardContent);

                    // Animation de fade-in avec un décalage pour chaque haut fait
                    setTimeout(() =>{
                        achievementCard.classList.remove("hidden");
                        achievementCard.classList.add("achievement-fade-in");

                        // Si c'est le dernier élément, on affiche le bouton
                        if(index === data.length - 1){
                            updateInfo(selectedLanguage);
                            nextButton.style.display = "block";

                            setTimeout(() =>{
                                nextButton.classList.add("show");
                            }, 300);
                        }
                    }, index * 300);

                    containerAchievement.appendChild(achievementCard);
                });

            })
            .catch(error => {
                console.error(`Une erreur est survenue lors de la génération des hauts faits: ${error}`);
            });
    });

    // Bouton de suite de génération
    nextButton.addEventListener("click", () =>{
        const randomAchievement = document.querySelector(".random-achievement");
        randomAchievement.style.display = "block";

        fetch("/getRandomAchievement")
            .then(response =>{
                return response.json();
            })
            .then(data =>{
                document.querySelector(".container-achievement").classList.add("hidden");
                nextButton.classList.add("hidden");

                const achievementCard = document.createElement("div");
                achievementCard.className = "achievement-card hidden";

                const achievementCardContent = document.createElement("div");
                achievementCardContent.className = "achievement-card-content";

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

                infoWrapper.appendChild(title);
                infoWrapper.appendChild(description);
                achievementCardContent.appendChild(icon);
                achievementCardContent.appendChild(infoWrapper);
                achievementCard.appendChild(achievementCardContent);

                setTimeout(() =>{
                    achievementCard.classList.remove("hidden");
                    achievementCard.classList.add("achievement-fade-in");
                }, 300);

                randomAchievement.appendChild(achievementCard);
            })
            .catch(error => {
                console.error(`Une erreur est survenue lors de la génération du haut fait: ${error}`);
            });
        });
});

document.querySelector(".home").addEventListener("click", () =>{
    location.reload();
});