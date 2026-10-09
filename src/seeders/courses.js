require('dotenv').config();
const Course = require('../Models/Course');

async function seedCourses() {
    try {
        await Course.bulkCreate([
        {
            name: "Administração"
        },

        {
            name: "Arquitetura e Urbanismo"
        },

        {
            name: "Biomedicina"
        },

        {
            name: "Ciência da Computação"
        },

        {
            name: "Ciências Aeronáuticas"
        },

        {
            name: "Ciências Contábeis"
        },

        {
            name: "Computação Gráfica"
        },

        {
            name: "Jornalismo"
        },

        {
            name: "Publicidade e Propaganda"
        },

        {
            name: "Design"
        },

        {
            name: "Design de Games"
        },

        {
            name: "Design de Moda"
        },

        {
            name: "Direito"
        },

        {
            name: "Engenharia Aeronáutica"
        },

        {
            name: "Engenharia Civil"
        },

        {
            name: "Engenharia da Computação"
        },

        {
            name: "Engenharia de Produção"
        },

        {
            name: "Estética"
        },

        {
            name: "Inteligência Artificial"
        },

        {
            name: "Manutenção de Aeronaves"
        },

        {
            name: "Nutrição"
        },

        {
            name: "Pedagogia"
        },

        {
            name: "Psicologia"
        },

        {
            name: "Sistemas Biomédicos"
        }
    ]);

    console.log("Cursos cadastrados com sucesso!");

    } catch (error) {
        console.log("Erro ao adicionar cursos: ", error);
    }
}

seedCourses();