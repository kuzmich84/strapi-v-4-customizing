'use strict';

/**
 *  order controller
 */

const {createCoreController} = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({strapi}) => ({
    confirmOrder: async (ctx, next) => {
      const {id} = ctx.request.params;
      const user = ctx.state.user;
      const order = await strapi.entityService.findOne("api::order.order", id, {
        populate:['owner']
      })
      if (!order) {
        return ctx.notFound('order not found')
      }

      if(order.confirmed) {
        return {
          message: "order yet confirmed"
        }
      }


      await strapi.entityService.update("api::order.order", id, {
        data: {
          confirmed: true,
          date_confirmed: new Date()
        }
      })


      return {
        message: "confirmed",
        order: await strapi.entityService.findOne("api::order.order", id)
      }

    },

    async create(ctx, next) {
      const user = ctx.state.user;
      const order = await strapi.entityService.create("api::order.order", {
        data: {
          products: ctx.request.body.data.products,
          owner: user.id
        }
      })

      return {order}
    },


  })
)

