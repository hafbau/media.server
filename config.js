module.exports = {

    'tokenSecret': 'ilovemesecreet',
    'db': {
        'development': 'mongodb://localhost:27017/mediaServer',
        'production': 'mongodb://localhost:27017/mediaServer',
        'test': 'mongodb://localhost:27017/mediaServerTest'
    }[process.env.NODE_ENV || 'development']

};
