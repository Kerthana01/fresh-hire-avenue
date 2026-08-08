WITH m(pattern, path) AS (VALUES
 ('amazon','/logos/amazon.png'),
 ('deloitte','/logos/deloitte.png'),
 ('wipro','/logos/wipro.png'),
 ('zoho','/logos/zoho.png'),
 ('qualcomm','/logos/qualcomm.png'),
 ('phonepe','/logos/phonepe.png'),
 ('reliance jio','/logos/reliance-jio.png'),
 ('larsen','/logos/larsen-toubro.png'),
 ('hexaware','/logos/hexaware.png'),
 ('microsoft','/logos/microsoft.png'),
 ('hcltech','/logos/hcltech.png'),
 ('salesforce','/logos/salesforce.png'),
 ('cisco','/logos/cisco.png'),
 ('emerson','/logos/emerson.png'),
 ('harman','/logos/harman.png'),
 ('sanmina','/logos/sanmina.png'),
 ('cognizant','/logos/cognizant.png'),
 ('waters','/logos/waters.png'),
 ('natwest','/logos/natwest.png'),
 ('honeywell','/logos/honeywell.png'),
 ('sentinelone','/logos/sentinelone.png'),
 ('nvidia','/logos/nvidia.png'),
 ('deutsche bank','/logos/deutsche-bank.png'),
 ('trimble','/logos/trimble.png'),
 ('mercedes-benz','/logos/mercedes-benz.png'),
 ('guidehouse','/logos/guidehouse.png'),
 ('vanderlande','/logos/vanderlande.png'),
 ('tower research','/logos/tower-research.png'),
 ('recruit crm','/logos/recruit-crm.png')
)
UPDATE public.jobs j
SET company_logo = m.path
FROM m
WHERE lower(btrim(j.company_name)) LIKE '%' || m.pattern || '%';

UPDATE public.jobs
SET company_logo = NULL
WHERE company_logo IS NOT NULL
  AND company_logo NOT LIKE '/logos/%';