const { User, Community, Post } = require('../src/models');

const mongoose = require('mongoose');

mongoose.connection
    .on('connected', async () => {
        console.log('Database connected');

        const bcrypt = require('bcrypt');

        const SALT_ROUNDS = 5;

        const user1 = await User.create({
            handle: 'MayankMittal',
            bio: 'I study at Delhi Technological University',
            password: await bcrypt.hash('mayankPassword', SALT_ROUNDS),
            avatar: 'sampleAvatar1.png',
        });
        const user2 = await User.create({
            handle: 'PushpakMittal',
            bio: 'I work at NewGen',
            password: await bcrypt.hash('pushpakPassword', SALT_ROUNDS),
            avatar: 'sampleAvatar2.png',
        });

        user1.followedUsers.push(user2._id);
        user2.numFollowing++;
        user2.followedUsers.push(user1._id);
        user1.numFollowing++;

        const community1 = await Community.create({
            name: 'DankMemes',
            description:
                'A communiy to share the dankest memes on the internet',
            banner: 'sampleBanner1.jpg',
            admin: user1._id,
        });
        user1.createdCommunities.push(community1._id);
        const community2 = await Community.create({
            name: 'AttackOnTitan',
            description: 'The offcial community of Attack On Titan anime',
            banner: 'sampleBanner2.jpg',
            admin: user2._id,
        });
        user2.createdCommunities.push(community2._id);

        user1.followedCommunities.push(community2._id);
        community2.numUsers++;
        user2.followedCommunities.push(community1._id);
        community1.numUsers++;

        const post1 = await Post.create({
            title: 'Pepe the frog',
            author: user1._id,
            belongsTo: community1._id,
            file: 'samplePostFile1.jpg',
        });
        user1.createdPosts.push(post1._id);
        community1.addedPosts.push(post1._id);
        const post2 = await Post.create({
            title: 'Eren Jaegar fan art',
            author: user2._id,
            belongsTo: community2._id,
            file: 'samplePostFile2.jpg',
        });
        user2.createdPosts.push(post2._id);
        community2.addedPosts.push(post2._id);

        user1.savedPosts.push(post2._id);
        user2.savedPosts.push(post1._id);

        post1.numLikes++;

        await Promise.all([
            user1.save(),
            user2.save(),
            community1.save(),
            community2.save(),
            post1.save(),
            post2.save(),
        ]);

        mongoose.connection.close();
    })
    .on('disconnected', () => console.log('Database disconnected'))
    .on('error', console.error);
