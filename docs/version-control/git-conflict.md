# Konflik pada Git

!!! note "AI Generated"

    Contoh konflik README dan alur penyelesaiannya disusun dengan bantuan AI.

Dua cabang dapat memperbarui baris README yang sama dengan isi yang berbeda. Saat Git tidak dapat memilih cara menggabungkannya, operasi merge berhenti supaya kita bisa menentukan isi akhir. Di sini `main` memakai judul “Panduan perangkat AIoT” dan cabang `petunjuk` memakai “Panduan sensor AIoT”.

## Menyelesaikan Konflik

Saat merge dihentikan, `git status` menunjukkan berkas yang perlu diselesaikan. Di bawah penanda `HEAD` terdapat isi dari cabang aktif pada contoh merge ini. Bagian di bawah pemisah menampilkan isi cabang yang sedang digabungkan.

    <<<<<<< HEAD
    # Panduan perangkat AIoT
    =======
    # Panduan sensor AIoT
    >>>>>>> petunjuk

1. Jalankan `git status`.
2. Buka README yang ditandai konflik.
3. Ganti seluruh blok konflik dengan judul `# Panduan perangkat dan sensor AIoT`.
4. Siapkan hasil dengan `git add README.md`.
5. Periksa isi yang disiapkan dengan `git diff --staged`.
6. Selesaikan merge dengan `git commit -m "merge: satukan judul README"`.

Jika perlu membatalkan merge yang sedang berjalan, gunakan `git merge --abort`. Sebelum mencoba merge berikutnya, periksa `git status` agar perubahan lokal yang masih perlu disimpan terlihat.

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-terminal:</span> **Git Lokal dan Repositori Sendiri** <span class="ai-practice-description">Buat perubahan yang memicu konflik dan periksa commit hasilnya.</span>](../hands-on/git-local-remote.md){ .ai-practice-start }

[<span class="ai-practice-icon" aria-hidden="true">:lucide-git-fork:</span> **Remote Repositories** <span class="ai-practice-description">Lihat cara membandingkan cabang lokal dengan perubahan di server.</span>](remote-repositories.md)

</div>
