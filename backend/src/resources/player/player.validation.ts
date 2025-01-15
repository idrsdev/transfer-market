import Joi from 'joi';

const create = Joi.object({
    name: Joi.string().required(),
    team_id: Joi.string().required(),
    position: Joi.string()
        .valid('Goalkeeper', 'Defender', 'Midfielder', 'Forward')
        .required(),
    base_price: Joi.number().required(),
});

const list = Joi.object({
    listing_price: Joi.number().required(),
});

export default { create, list };
