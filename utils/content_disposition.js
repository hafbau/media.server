module.exports = (type, name) => {
    if (type.includes('image')) return `inline; filename=${name}`
    return `attachment; filename=${name}`
}