import Joi from 'joi';

const create = Joi.object({
    name: Joi.string().required().min(3).max(50),
    players: Joi.array()
        .items(
            Joi.object({
                name: Joi.string().required(),
                position: Joi.string()
                    .valid('Goalkeeper', 'Defender', 'Midfielder', 'Forward')
                    .required(),
                base_price: Joi.number().required(),
            })
        )
        .required(),
});

const search = Joi.object({
    search: Joi.string().optional(),
    limit: Joi.number().optional().default(10),
});

export default { create, search };
