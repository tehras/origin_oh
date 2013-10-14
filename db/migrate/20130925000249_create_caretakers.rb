class CreateCaretakers < ActiveRecord::Migration
  def change
    create_table :caretakers do |t|
      t.string :first_name
      t.string :last_name
      t.string :email
      t.float :age
      t.string :nationality
      t.text :comment
      t.boolean :citizen
      t.boolean :car
      t.boolean :driver_license
      t.float :english

      t.timestamps
    end
  end
end
