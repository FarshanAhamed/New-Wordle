using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
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
        public char[] Sample { get; } = WordList.GetRandomWord();
        public string SampleHash { get 
            { return JsonSerializer.Serialize(Hash(Sample)); } }
        public int Width { get { return LetterCount * (50 + (2 * 2)) + (LetterCount - 1) * 5; } }
        public int Height { get { return TryCount * (50 + (2 * 2)) + (TryCount - 1) * 5; } }
        
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

        private string[] EncodeThis(char[] s)
        {
            string key = "35353535353535366363636363";
            List<string> sample = new List<string>();

            foreach (var c in s)
            {
                string credentials = c.ToString();

                var encodingCred = new System.Text.ASCIIEncoding();
                var encodingKey = new System.Text.ASCIIEncoding();
                //byte[] keyByte = encodingKey.GetBytes(key);
                byte[] keyByte = StringToByteArray(key);
                byte[] credentialsBytes = encodingCred.GetBytes(credentials);
                using (var hmacsha1 = new HMACSHA1(keyByte))
                {
                    byte[] hashmessage = hmacsha1.ComputeHash(credentialsBytes);
                    string hash = BitConverter.ToString(hashmessage).Replace("-", string.Empty).ToLower();
                    sample.Add(hash);
                }
            }

            return sample.ToArray();
        }

        private byte[] StringToByteArray(string hex)
        {
            int NumberChars = hex.Length;
            byte[] bytes = new byte[NumberChars / 2];
            for (int i = 0; i < NumberChars; i += 2)
                bytes[i / 2] = Convert.ToByte(hex.Substring(i, 2), 16);
            return bytes;
        }

    }
}
