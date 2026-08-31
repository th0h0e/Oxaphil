// TemPad Dev — get_structure reader (run via pi `mcpScript`)
//
// Why this exists:
// Same content-vs-structuredContent split as get_code: TemPad returns the
// hierarchy/geometry outline in `structuredContent`, but pi's direct-tool
// call only surfaces the short `content` summary to the model. This script
// reads `data.structuredContent` and returns it as the model-facing result.
//
// When to use: resolve hierarchy, geometry, or overlap uncertainty — or to
// pick a narrower nodeId for a follow-up get_code retry (depth-cap, shell
// response, auto-layout=inferred). get_structure is NOT style truth; for
// styles/tokens/assets use tempad-dev-get-code.mjs instead.
//
// Interface (pi-mcp-adapter): tools.call(path, args) -> { ok, data | error };
// emit(value) for user-visible output; the final `return` is the model-facing
// result, passed through the normal MCP output guard.

// ── CONFIG: edit per run if needed ────────────────────────────────────
const NODE_ID = undefined;  // omit → uses current Figma selection
const DEPTH   = undefined;  // omit → full tree (subject to safety caps)
// ─────────────────────────────────────────────────────────────────────

// Tool path is `<serverName>_<toolName>`; server is "tempad-dev" in mcp.json.
// If the server is renamed, update TOOL (and the skill's reference) to match.
const TOOL = 'tempad-dev_get_structure';

const args = {
  ...(NODE_ID ? { nodeId: NODE_ID } : {}),
  ...(DEPTH !== undefined ? { options: { depth: DEPTH } } : {}),
};

const r = await tools.call(TOOL, args);

// Failed MCP calls do not throw — they return { ok: false, error }. Stop here.
if (!r.ok) {
  emit({ error: r.error, tool: TOOL, args });
  return r;
}

const sc = r.data?.structuredContent;

// TemPad returns structuredContent on success. If it is missing, the extension
// likely returned only the short content summary (wrong tab / not active).
if (!sc) {
  emit({ error: 'no structuredContent in response', content: r.data?.content });
  return r;
}

// Emit a short orientation line; return the full payload as the model-facing
// result. Returning `sc` (not r.data) keeps model text focused on structure.
// The output guard caps oversized responses and spills to a temp file.
emit({ keys: Object.keys(sc) });

return sc;  // model sees the structural + geometry outline
