const Joi = require('joi');


module.exports.ListingSchema= Joi.object({
    listing: Joi.object({
title: Joi.string().required(),
description:Joi.string().required(),
price:Joi.number().min(0).required(),
Image:Joi.string().allow("",null),
location:Joi.string().required(),
country:Joi.string().required(),
    }).required()

})
