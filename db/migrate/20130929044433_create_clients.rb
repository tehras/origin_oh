class CreateClients < ActiveRecord::Migration
  def change
    create_table :clients do |t|
      t.string :first_name
      t.string :last_name
      t.string :email
      t.string :home_number
      t.string :mobile_phone
      t.string :fax_number
      t.string :street
      t.string :state
      t.string :zip
      t.string :nationality
      t.string :languages
      t.float :english
      t.float :years
      t.string :hha
      t.boolean :driver_license
      t.boolean :car
      t.string :notes

      t.timestamps
    end
  end
end
