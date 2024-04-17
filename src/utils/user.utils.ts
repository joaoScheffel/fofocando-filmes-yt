import {sortItemArray} from "./array.utils"

export const randomUsername = (): string => {
    const animalsGender = {
        "Gato": "m",
        "Doguinho": "m",
        "Peixe-Espada": "m",
        "Ouriço": "m",
        "Ouriço-do-Mar": "m",
        "Guaxinim": "m",
        "João de Barro": "m",
        "Sabiá": "m",
        "Calopsita": "f",
        "Tucano": "m",
        "Jaguatirica": "f",
        "Coruja": "f",
        "Elefante": "m",
        "Onça-Pintada": "f",
        "Arara Azul": "f",
        "Capivara": "f",
        "Golfinho": "m",
        "Sapo": "m",
        "Borboleta": "f",
        "Búfalo": "m",
        "Cavalo": "m",
        "Gaivota": "f",
        "Tubarão": "m",
        "Falcão": "m",
        "Lontra": "f",
        "Furão": "m",
        "Raposa": "f",
        "Ovelha": "f",
        "Bode": "m",
    }

    const adjectivesGender = {
        "Falante": "Falante",
        "Feliz": "Feliz",
        "Fofoqueiro": "Fofoqueira",
        "Bonito": "Bonita",
        "Esperto": "Esperta",
        "Nadador": "Nadadora",
        "Alegre": "Alegre",
        "Amigável": "Amigável",
        "Brilhante": "Brilhante",
        "Calmo": "Calma",
        "Carinhoso": "Carinhosa",
        "Divertido": "Divertida",
        "Doce": "Doce",
        "Educado": "Educada",
        "Elegante": "Elegante",
        "Encantador": "Encantadora",
        "Energético": "Energética",
        "Generoso": "Generosa",
        "Gentil": "Gentil",
        "Honesto": "Honesto",
        "Otimista": "Otimista",
        "Paciente": "Paciente",
        "Respeitoso": "Respeitosa",
        "Sábio": "Sábia",
        "Sonhador": "Sonhadora",
        "Valente": "Valente",
    }

    const randomAnimal = sortItemArray(Object.keys(animalsGender))
    const randomAdjective = sortItemArray(Object.keys(adjectivesGender))

    const finalAdjective = animalsGender[randomAnimal] === 'm' ? randomAdjective : adjectivesGender[randomAdjective]

    return animalsGender[randomAnimal] === 'm' ? `${randomAnimal} ${finalAdjective}` : `${randomAnimal} ${finalAdjective}`
}