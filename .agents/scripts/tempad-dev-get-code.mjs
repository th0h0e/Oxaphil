// TemPad Dev — get_code reader (run via pi `mcpScript`)
//
// Why this exists:
// TemPad returns the real code, tokens, and assets in `structuredContent`,
// but pi's direct-tool call only surfaces the short `content` summary to the
// model — pi-mcp-adapter drops `structuredContent` from model-facing text per
// the MCP SDK contract (content wins when both are present). This script
// calls the tool through mcpScript, which can read `data.structuredContent`,
// and returns it as the script result so the model sees the full design data.
//
// Interface (pi-mcp-adapter): tools.call(path, args) -> { ok, data | error };
// emit(value) for user-visible output; the final `return` is the model-facing
// result, passed through the normal MCP output guard.

// ── CONFIG: edit per run if needed ────────────────────────────────────
const NODE_ID        = undefined;  // omit → uses current Figma selection
const PREFERRED_LANG = 'vue';     // 'vue' | 'jsx' — bias output language
const RESOLVE_TOKENS = false;     // false = keep token refs; true = inline values
const VECTOR_MODE    = 'smart';    // 'smart' (default) | 'snapshot'
// ─────────────────────────────────────────────────────────────────────

// Tool path is `<serverName>_<toolName>`; server is "tempad-dev" in mcp.json.
// If the server is renamed, update TOOL (and the skill's reference) to match.
const TOOL = 'tempad-dev_get_code';

const args = {
  ...(NODE_ID ? { nodeId: NODE_ID } : {}),
  preferredLang: PREFERRED_LANG,
  resolveTokens: RESOLVE_TOKENS,
  vectorMode: VECTOR_MODE,
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
// result. Returning `sc` (not r.data) keeps model text focused on design data.
// The output guard caps oversized responses and spills to a temp file.
emit({
  lang: sc.lang,
  tokenCount: sc.tokens ? Object.keys(sc.tokens).length : 0,
  assetCount: (sc.assets || []).length,
  warnings: sc.warnings,
  codegen: sc.codegen,
});

return sc;  // model sees: lang, code, tokens, assets, codegen, warnings
