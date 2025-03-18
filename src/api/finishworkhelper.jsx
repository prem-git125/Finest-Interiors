export default function asset(path) {
    return import.meta.env.VITE_FINISHWORK_BASE_URL + `${path}`;
}