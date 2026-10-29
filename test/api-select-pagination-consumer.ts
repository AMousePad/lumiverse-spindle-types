import type { SpindleFrontendContext, SpindleAPI, SpindleSelectOptions, SpindleMultiSelectOptions, CharacterDTO, WorkerToHost } from "lumiverse-spindle-types";

declare const ctx: SpindleFrontendContext;
declare const api: SpindleAPI;
declare const target: HTMLElement;
declare const character: CharacterDTO;

const options: SpindleSelectOptions = {
  forceSearch: true, remoteSearch: true, loading: false, hasMore: true, loadMoreOnScroll: true,
  onSearchChange(query) { void api.characters.list({ search: query, limit: 50, offset: 0 }); },
  onLoadMore() { void api.characters.list({ limit: 50, offset: 50 }); },
  loadingMessage: "Loading characters…", loadMoreLabel: "Load more characters",
  options: [{ value: character.id, label: character.name, leading: { type: "image", src: character.avatar_url ?? "", fallback: { text: character.name[0] } } }],
};
const single = ctx.components.mountSelect(target, options);
single.update({ loading: true });
const multi: SpindleMultiSelectOptions = { ...options, value: [character.id], onChange: values => { values.map(String); } };
ctx.components.mountMultiSelect(target, multi);
const legacy: SpindleSelectOptions = { options: [{ value: "a", label: "A" }] };
ctx.components.mountSelect(target, legacy);
const wire: WorkerToHost = { type: "characters_list", requestId: "search", search: "Mira", offset: 0 };
void wire;
