<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Noche Quieta
- Estado de la app (perfil, noches, ajustes) en localStorage vía `src/lib/noche/store.tsx`; no hay backend en el MVP, para que el check-in funcione offline.
- La lógica del plan de 14 noches vive solo en `src/lib/noche/plan.ts` y los textos en `src/lib/noche/content.ts`, para cambiar reglas sin tocar pantallas.
