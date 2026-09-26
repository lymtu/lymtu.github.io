export function getParticleTintColor(): string {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "#adadad"
    : "#48484a";
}

export function watchParticleTintColor(onChange: (color: string) => void) {
  const query = window.matchMedia("(prefers-color-scheme: dark)");
  const notify = () => onChange(getParticleTintColor());

  query.addEventListener("change", notify);

  return () => {
    query.removeEventListener("change", notify);
  };
}
