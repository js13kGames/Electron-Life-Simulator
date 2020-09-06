export const timestamp = parseInt(
    document
        .querySelector("title")
        .textContent.split(' ')
        .slice(-1)[0]
)
export const date = new Date( timestamp )
