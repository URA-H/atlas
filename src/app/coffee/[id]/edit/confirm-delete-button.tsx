"use client";

export function ConfirmDeleteButton({ coffeeName }: { coffeeName: string }) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!confirm(`「${coffeeName}」を本当に削除しますか？元に戻せません。`)) {
          e.preventDefault();
        }
      }}
      className="rounded-full border border-destructive bg-transparent px-5 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive hover:text-paper"
    >
      削除する
    </button>
  );
}
