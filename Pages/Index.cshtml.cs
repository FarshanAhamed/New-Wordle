using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Caching.Memory;
using NewWordle.Services;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace NewWordle.Pages
{
    public class IndexModel : PageModel
    {
        public int LetterCount { get; } = 5;
        public int TryCount { get; } = 6;
        //public char[] Sample { get; } = { 'E', 'A', 'R', 'L', 'Y' };
        public char[] Sample { get; set; }
        public string SampleHash { get; set; } 
            
        public int Width { get { return LetterCount * (50 + (2 * 2)) + (LetterCount - 1) * 5; } }
        public int Height { get { return TryCount * (50 + (2 * 2)) + (TryCount - 1) * 5; } }

        private readonly IMemoryCache _memoryCache;
        public string Wordd { get; set; } = "Sample";

        public IndexModel(IMemoryCache memoryCache)
        {
            _memoryCache = memoryCache;

            if (!_memoryCache.TryGetValue("word", out string word))
            {
                Sample = WordList.GetRandomWord();
                word = new string(Sample);
                SampleHash = JsonSerializer.Serialize(Hash(Sample));

                var cacheEntryOptions = new MemoryCacheEntryOptions()
                    .SetSlidingExpiration(DateTime.UtcNow.Date.AddDays(1) - DateTime.UtcNow);

                _memoryCache.Set("word", word, cacheEntryOptions);
            }
            else
            {
                Sample = word.ToCharArray();
                SampleHash = JsonSerializer.Serialize(Hash(Sample));
            }
        }

        public void OnGet()
        {           

        }

        public string[] Hash(char[] s)
        {
            List<string> sample = new List<string>();

            foreach (var input in s)
            {
                using (SHA256 hasher = SHA256.Create())
                {
                    // Convert the input string to a byte array and compute the hash.
                    byte[] data = hasher.ComputeHash(Encoding.UTF8.GetBytes(input.ToString())); // Note that UTF8 here

                    // Create a new Stringbuilder to collect the bytes
                    // and create a string.
                    StringBuilder sBuilder = new StringBuilder();

                    // Loop through each byte of the hashed data 
                    // and format each one as a hexadecimal string.
                    for (int i = 0; i < data.Length; i++)
                    {
                        sBuilder.Append(data[i].ToString("X2"));
                    }

                    // Return the hexadecimal string.
                    sample.Add( $"0x{sBuilder.ToString().ToLower()}");
                }
            }

            return sample.ToArray();
        }
    }
}
