import * as Sequelize from 'sequelize';

export class Models {
    public static define(sequelize: Sequelize.Sequelize): {
        Application: Sequelize.Model<{}, {}>,
        Chat: Sequelize.Model<{}, {}>,
        Message: Sequelize.Model<{}, {}>,
        MetaDatum: Sequelize.Model<{}, {}>,
        Team: Sequelize.Model<{}, {}>,
        User: Sequelize.Model<{}, {}>,
    } {

        const ApplicationModel = sequelize.define('application', {
            name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });

        const ChatModel = sequelize.define('chat', {
            numberofUnreadMessages: {
                allowNull: false,
                type: Sequelize.NUMERIC,
            },
            owner: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            sessionId: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });

        const MessageModel = sequelize.define('message', {
            from: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            message: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });

        const MetaDatumModel = sequelize.define('meta-datum', {
            name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            value: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });

        const TeamModel = sequelize.define('team', {
            accepted: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            owner: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });

        const UserModel = sequelize.define('user', {
            displayName: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            emailAddress: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            expiryTimestamp: {
                allowNull: false,
                type: Sequelize.NUMERIC,
            },
            token: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });

        TeamModel.hasMany(ApplicationModel, { foreignKey: { allowNull: true }, onDelete: 'CASCADE' });
        ApplicationModel.belongsTo(TeamModel, { foreignKey: { allowNull: true }, onDelete: 'CASCADE' });

        ApplicationModel.hasMany(ChatModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        ChatModel.belongsTo(ApplicationModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        ChatModel.hasMany(MessageModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        MessageModel.belongsTo(ChatModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        MessageModel.hasMany(MetaDatumModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        MetaDatumModel.belongsTo(MessageModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        return {
            Application: ApplicationModel,
            Chat: ChatModel,
            Message: MessageModel,
            MetaDatum: MetaDatumModel,
            Team: TeamModel,
            User: UserModel,
        };
    }
}
