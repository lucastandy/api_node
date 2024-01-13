'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Criando registros da tabela "users"
    return queryInterface.bulkInsert('Users', [
      {
        name: "Cesar",
        email: "cesar@celke.com.br",
        situationId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Cesar 2",
        email: "cesar@celke2.com.br",
        situationId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Cesar 3",
        email: "cesar@celke3.com.br",
        situationId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Cesar 4",
        email: "cesar@celke4.com.br",
        situationId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Cesar 5",
        email: "cesar@celke5.com.br",
        situationId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Cesar 6",
        email: "cesar@celke6.com.br",
        situationId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Cesar 7",
        email: "cesar@celke7.com.br",
        situationId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Cesar 8",
        email: "cesar@celke8.com.br",
        situationId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Cesar 9",
        email: "cesar@celke9.com.br",
        situationId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Cesar 10",
        email: "cesar@celke10.com.br",
        situationId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Cesar 11",
        email: "cesar@celke11.com.br",
        situationId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Cesar 12",
        email: "cesar@celke12.com.br",
        situationId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Cesar 13",
        email: "cesar@celke13.com.br",
        situationId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Cesar 14",
        email: "cesar@celke14.com.br",
        situationId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Cesar 15",
        email: "cesar@celke15.com.br",
        situationId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Cesar 16",
        email: "cesar@celke16.com.br",
        situationId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Cesar 17",
        email: "cesar@celke17.com.br",
        situationId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Cesar 18",
        email: "cesar@celke18.com.br",
        situationId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Cesar 19",
        email: "cesar@celke19.com.br",
        situationId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Cesar 20",
        email: "cesar@celke20.com.br",
        situationId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Cesar 21",
        email: "cesar@celke21.com.br",
        situationId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Cesar 22",
        email: "cesar@celke22.com.br",
        situationId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Cesar 23",
        email: "cesar@celke23.com.br",
        situationId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Cesar 24",
        email: "cesar@celke24.com.br",
        situationId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Cesar 25",
        email: "cesar@celke25.com.br",
        situationId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Cesar 26",
        email: "cesar@celke26.com.br",
        situationId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Cesar 27",
        email: "cesar@celke27.com.br",
        situationId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Cesar 28",
        email: "cesar@celke28.com.br",
        situationId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Cesar 29",
        email: "cesar@celke29.com.br",
        situationId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Cesar 30",
        email: "cesar@celke30.com.br",
        situationId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Cesar 31",
        email: "cesar@celke31.com.br",
        situationId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
  
    ]);
    
  },

  async down (queryInterface, Sequelize) {
    
  }
};
