import * as Sequelize from 'sequelize';

export class Models {
    public static define(sequelize: Sequelize.Sequelize): {
        Application: Sequelize.Model<{}, {}>,
        Chat: Sequelize.Model<{}, {}>,
        ChatRecipient: Sequelize.Model<{}, {}>,
        Message: Sequelize.Model<{}, {}>,
        MetaDatum: Sequelize.Model<{}, {}>,
        Team: Sequelize.Model<{}, {}>,
        TeamParticipant: Sequelize.Model<{}, {}>,
        User: Sequelize.Model<{}, {}>,
    } {

        const ApplicationModel = sequelize.define('application', {
            name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });

        const ChatModel = sequelize.define('chat', {
            sessionId: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });

        const ChatRecipientModel = sequelize.define('chatRecipient', {
            timestamp: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });

        const MessageModel = sequelize.define('message', {
            sender: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            text: {
                allowNull: false,
                type: Sequelize.TEXT,
            },
        });

        const MetaDatumModel = sequelize.define('metaDatum', {
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
            name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });

        const TeamParticipantModel = sequelize.define('teamParticipant', {
            accepted: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
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

        ChatModel.hasMany(ChatRecipientModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        ChatRecipientModel.belongsTo(ChatModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        ChatModel.hasMany(MetaDatumModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        MetaDatumModel.belongsTo(ChatModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        UserModel.hasMany(ChatModel, { as: 'chatOwner', foreignKey: { allowNull: true, name: 'chatOwnerId' }, onDelete: 'CASCADE' });
        ChatModel.belongsTo(UserModel, { as: 'chatOwner', foreignKey: { allowNull: true, name: 'chatOwnerId' }, onDelete: 'CASCADE' });

        UserModel.hasMany(ChatRecipientModel, { foreignKey: { allowNull: true }, onDelete: 'CASCADE' });
        ChatRecipientModel.belongsTo(UserModel, { foreignKey: { allowNull: true }, onDelete: 'CASCADE' });

        UserModel.hasMany(TeamModel, { as: 'teamOwner', foreignKey: { allowNull: false, name: 'teamOwnerId' }, onDelete: 'CASCADE' });
        TeamModel.belongsTo(UserModel, { as: 'teamOwner', foreignKey: { allowNull: false, name: 'teamOwnerId' }, onDelete: 'CASCADE' });

        UserModel.hasMany(TeamParticipantModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        TeamParticipantModel.belongsTo(UserModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        TeamModel.hasMany(TeamParticipantModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        TeamParticipantModel.belongsTo(TeamModel, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        return {
            Application: ApplicationModel,
            Chat: ChatModel,
            ChatRecipient: ChatRecipientModel,
            Message: MessageModel,
            MetaDatum: MetaDatumModel,
            Team: TeamModel,
            TeamParticipant: TeamParticipantModel,
            User: UserModel,
        };
    }
}
