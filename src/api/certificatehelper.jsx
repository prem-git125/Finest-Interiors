export default function asset(path) {
    return import.meta.env.VITE_CERTI_BASE_URL + `${path}`
}