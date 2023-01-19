## 2022-miss-aclc-iriga
The tabulation system used in the
[Search for Miss ACLC Iriga 2022](https://github.com/kulotsystems/pageant-tabulations/tree/master/2022-miss-aclc-iriga).

### Installation

1. Download and install [XAMPP](https://www.apachefriends.org/download.html).
2. Clone or download this repository to the `xampp/htdocs` folder.<br>
   The final path should be: `/xampp/htdocs/2022-miss-aclc-iriga`.<br>
3. Open <http://localhost/phpmyadmin> in your browser.
4. Create a database named `tbltn_2022_miss_aclc_iriga`.
5. Import `tbltn_2022_miss_aclc_iriga.sql` from this repository to your newly created database.

### Database Configuration
Configure database connection at [php/db/open.php](php/db/open.php).

### Judge Login
Open <http://localhost/2022-miss-aclc-iriga> in your web browser.

| Judge # | Username  | Password  |
|:-------:|:---------:|:---------:|
|    1    | `judge01` | `judge01` |
|    2    | `judge02` | `judge02` |
|    3    | `judge03` | `judge03` |
|    4    | `judge04` | `judge04` |
|    5    | `judge05` | `judge05` |


### Admin Login
Open <http://localhost/2022-miss-aclc-iriga/admin> in your web browser.

|   Admin    | Username | Password |
|:----------:|:--------:|:--------:|
| Super User | `admin`  | `123456` |

- only `Portions` and `Criteria` can be viewed and set on admin page
- other entities are manually inputted in the database

### Top 10
Top 10 candidates are entered in [top10.txt](top10.txt) (one candidate number per line).