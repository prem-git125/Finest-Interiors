export default function asset(path) {
    return import.meta.env.VITE_ASSETS_BASE_URL + `${path}`;
}

